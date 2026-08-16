import re
from typing import List, Dict, Any, Tuple, Optional

SYSTEM_RAG_PROMPT = """
You are the official AI Assistant for the Innovate AI Hackathon.
Your goal is to answer participant queries accurately, politely, comprehensively, and strictly grounded in the official Innovate AI Hackathon Rulebook & Participant Handbook.

STRICT GROUNDING & PROBLEM-SOLVING RULES:
1. Answer using verified facts from the Rulebook & Participant Handbook sections.
2. When answering policy, logistics, rules, or judging questions, provide clear, actionable problem-solving guidance and reference the relevant section (e.g., Section 2.2, Section 3.4, Section 5.3, Appendix A).
3. If the user asks a multi-part query (e.g. eligibility + tools + food), address EVERY sub-problem clearly with numbered/bulleted points.
4. For casual or silly questions (e.g., "can AI build itself while I sleep?", "is coffee unlimited?"), provide a witty yet accurate answer grounded in Section 10 / rules.
5. Always be encouraging, professional, and empathetic to hackathon participants.
"""

def format_context_prompt(query: str, retrieved_chunks: List[Dict[str, Any]]) -> str:
    """
    Constructs the prompt containing retrieved knowledge context chunks.
    """
    if not retrieved_chunks:
        context_str = "No relevant context found in the official knowledge base."
    else:
        context_blocks = []
        for idx, chunk in enumerate(retrieved_chunks, start=1):
            block = (
                f"[Chunk {idx}]\n"
                f"Source Document: {chunk['document_name']} (Page/Section {chunk.get('page_number', 1)})\n"
                f"Content:\n{chunk['content']}\n"
            )
            context_blocks.append(block)
        context_str = "\n---\n".join(context_blocks)

    user_prompt = (
        f"CONTEXT CHUNKS FROM INNOVATE AI HACKATHON KNOWLEDGE BASE:\n"
        f"{context_str}\n\n"
        f"USER QUESTION:\n{query}\n\n"
        f"INSTRUCTION:\nAnswer the user question comprehensively based on the context chunks above. Include relevant citations (e.g. Section numbers) and step-by-step solutions if troubleshooting."
    )
    return user_prompt

def extract_dynamic_answer(query: str, chunks: List[Dict[str, Any]]) -> str:
    """
    Extracts and ranks the most relevant paragraphs and sentences matching the user's query intent.
    """
    generic_words = {
        "what", "is", "the", "are", "how", "can", "i", "we", "a", "an", "do", "in", "to", 
        "for", "of", "and", "or", "on", "with", "my", "our", "your", "should", "would", 
        "you", "this", "about", "hackathon", "official", "guide", "2026", "innovate", "rule", "rules"
    }
    
    words = [w for w in re.findall(r'\w+', query.lower()) if w not in generic_words and len(w) > 2]
    if not words:
        words = [w for w in re.findall(r'\w+', query.lower()) if len(w) > 2]

    paragraphs = []
    for chunk in chunks:
        raw_lines = [line.strip() for line in chunk["content"].split("\n") if line.strip()]
        
        current_block = []
        for line in raw_lines:
            if line.startswith("# INNOVATE"):
                continue
            if line.startswith("## ") or line.startswith("### ") or line.startswith("- Q:") or line.startswith("• "):
                if current_block:
                    paragraphs.append("\n".join(current_block))
                    current_block = []
            current_block.append(line)
        if current_block:
            paragraphs.append("\n".join(current_block))

    scored_paragraphs = []
    for p in paragraphs:
        p_lower = p.lower()
        score = 0
        for w in words:
            if w in p_lower:
                score += 3
                # Exact word boundary match bonus
                if re.search(r'\b' + re.escape(w) + r'\b', p_lower):
                    score += 2
        if score > 0:
            scored_paragraphs.append((score, p))

    scored_paragraphs.sort(key=lambda x: x[0], reverse=True)

    if scored_paragraphs:
        selected = []
        seen = set()
        total_len = 0
        for score, p in scored_paragraphs:
            p_clean = p.strip()
            if p_clean not in seen and total_len < 1200:
                selected.append(p_clean)
                seen.add(p_clean)
                total_len += len(p_clean)
        return "\n\n".join(selected)

    if chunks:
        clean_lines = [line.strip() for line in chunks[0]["content"].split("\n") if line.strip() and not line.startswith("# INNOVATE")]
        return "\n\n".join(clean_lines)[:750].strip()

    return "I could not find specific information regarding your query in the official handbook. Please check with the 24/7 Help Desk."

def solve_direct_intents(query: str) -> Tuple[Optional[str], List[Dict[str, Any]]]:
    """
    Handles specialized direct FAQs and intent routing for instant high-accuracy resolution.
    """
    q_lower = query.lower().strip()
    
    # 1. Greetings
    greetings = ["hey", "hello", "hi", "how are you", "good morning", "good afternoon", "greetings", "hey assistant", "yo", "sup"]
    if any(q_lower == g or q_lower.startswith(g + " ") or q_lower.startswith(g + ",") or q_lower.startswith(g + "!") for g in greetings):
        msg = (
            "👋 **Hello! Welcome to the Innovate AI Hackathon AI Assistant.**\n\n"
            "I can assist you with:\n"
            "• **Rules & AI Usage** (Claude, ChatGPT, Copilot, pre-trained models)\n"
            "• **Eligibility & Teams** (2–4 members, student verification, age rules)\n"
            "• **Schedule & Submissions** (GitHub repo, 2–3 min demo video, slide deck)\n"
            "• **Logistics & Food** (Complimentary meals, dietary options, dorm stay, Wi-Fi)\n"
            "• **Judging & Rubric** (25% Innovation, 25% Technical, 20% Impact, 15% UX, 15% Demo)\n"
            "• **Complaints & Emergency Support** (24/7 Help Desk, Escalation matrix, confidential reports)\n\n"
            "What would you like help with today?"
        )
        return msg, [{"document": "Innovate_AI_Hackathon_Rulebook_2026.md", "page": 1, "chunk_index": 0, "snippet": "Innovate AI Hackathon Official Handbook Overview"}]

    # 2. Solo participation doubt
    if ("alone" in q_lower or "solo" in q_lower or "individual" in q_lower or "single" in q_lower) and ("participate" in q_lower or "join" in q_lower or "team" in q_lower or "allowed" in q_lower):
        msg = (
            "❌ **No, solo participation is not permitted.**\n\n"
            "• **Team Size Requirement**: Every team must have **minimum 2 and maximum 4 members** (Section 2.2).\n"
            "• **Need Teammates?** Use the **#team-finder** channel on the official Discord/WhatsApp community to connect with other participants before the team lock deadline (24 hours before the event)."
        )
        return msg, [{"document": "Innovate_AI_Hackathon_Rulebook_2026.md", "page": 1, "chunk_index": 1, "snippet": "Section 2.2: Team Formation — minimum of 2 and a maximum of 4 members."}]

    # 3. AI / ChatGPT / Claude / Copilot rules
    if any(k in q_lower for k in ["chatgpt", "claude", "copilot", "ai tools", "ai assistant", "llm allowed", "generative ai", "can we use ai", "can i use ai", "use chatgpt"]):
        msg = (
            "✅ **Yes! The use of AI coding assistants is explicitly permitted and encouraged.** (Section 3.4)\n\n"
            "• **Permitted Tools**: ChatGPT, Claude, GitHub Copilot, Cursor, and open-source models.\n"
            "• **Crucial Requirement**: Every team must be able to **explain and defend every part of their submitted code and architecture** during judging. AI-generated code you cannot explain will be treated as unoriginal.\n"
            "• **Disclosure**: Any third-party model, API, or dataset used must be disclosed in your submission form (Section 3.4)."
        )
        return msg, [{"document": "Innovate_AI_Hackathon_Rulebook_2026.md", "page": 2, "chunk_index": 2, "snippet": "Section 3.4: Responsible & Permitted Use of AI Tools — AI coding assistants explicitly permitted."}]

    # 4. Food / Catering / Vegan / Halal / Jain / Midnight Snacks
    if any(k in q_lower for k in ["food", "meal", "dinner", "lunch", "breakfast", "pizza", "snack", "coffee", "tea", "vegan", "jain", "gluten", "catering"]):
        msg = (
            "🍕 **Food & Catering Logistics (Section 5.3):**\n\n"
            "• **100% Free Meals Provided**: Dinner on Day 1, Midnight snacks, Breakfast, Lunch, and Dinner on Day 2, plus continuous tea/coffee and water.\n"
            "• **Dietary Accommodations**: Vegetarian, Vegan, Jain, Gluten-Free, and allergy preferences submitted during registration are fully catered.\n"
            "• **Forgot Dietary Preference?** Ask immediately at the **24/7 Help Desk** — organizers will do their best to accommodate you.\n"
            "• **Outside Food**: Permitted in dining areas, but cannot be stored in shared catering refrigerators."
        )
        return msg, [{"document": "Innovate_AI_Hackathon_Rulebook_2026.md", "page": 3, "chunk_index": 4, "snippet": "Section 5.3: Food & Refreshments — All meals provided across 36 hours."}]

    # 5. Judging Rubric & Breakdown
    if "rubric" in q_lower or "scoring" in q_lower or ("judging" in q_lower and ("criteria" in q_lower or "percent" in q_lower or "weight" in q_lower or "points" in q_lower)):
        msg = (
            "⚖️ **Official Judging Rubric & Weights (Section 4.2):**\n\n"
            "1. 💡 **Innovation & Originality (25%)**: Novelty of the idea and approach relative to existing solutions.\n"
            "2. 💻 **Technical Implementation (25%)**: Working prototype, code quality, sound AI/ML architecture.\n"
            "3. 🌍 **Real-World Impact & Feasibility (20%)**: Practical usefulness, market/social relevance, scalability.\n"
            "4. 🎨 **User Experience & Design (15%)**: Usability, interface polish, intuitive design.\n"
            "5. 🎤 **Presentation & Demo (15%)**: Clarity of pitch, live working demo quality, ability to answer Q&A.\n\n"
            "• **Rounds**: Round 1 (Mentor Screening) ➔ Round 2 (Preliminary Scoring) ➔ Round 3 (Live 5-min Demo + 3-min Q&A Finals)."
        )
        return msg, [{"document": "Innovate_AI_Hackathon_Rulebook_2026.md", "page": 3, "chunk_index": 3, "snippet": "Section 4.2: Scoring Rubric — 25% Innovation, 25% Tech, 20% Impact, 15% UX, 15% Demo."}]

    # 6. Submission Checklist & Deadlines
    if "checklist" in q_lower or "pre-submission" in q_lower or "what to submit" in q_lower or "submission package" in q_lower:
        msg = (
            "📦 **Official Pre-Submission Checklist (Section 3.6):**\n\n"
            "1. 🐙 **GitHub Repository**: Public or organizer-accessible repo with clean source code.\n"
            "2. 📄 **README**: Detailed setup instructions, architecture diagram, and tech stack.\n"
            "3. 🎥 **Demo Video**: 2 to 3-minute video showing the functional working prototype.\n"
            "4. 📑 **Slide Deck**: Short presentation deck (maximum 10 slides).\n"
            "5. ⚖️ **Third-Party Disclosure**: List all pre-trained models, datasets, or APIs used.\n\n"
            "⚠️ **Hard Deadline Notice**: The portal closes automatically. Late submissions are **not accepted under any circumstances** — submit at least 30 minutes early!"
        )
        return msg, [{"document": "Innovate_AI_Hackathon_Rulebook_2026.md", "page": 2, "chunk_index": 2, "snippet": "Section 3.6: Submission Rules — GitHub repo, README, 2-3 min video, max 10 slides."}]

    # 7. Sleeping / Accommodation / Nap areas
    if any(k in q_lower for k in ["sleep", "nap", "accommodation", "dorm", "rest", "bed", "overnight"]):
        msg = (
            "🛌 **Sleep & Accommodation Facilities (Sections 5.1 & 5.4):**\n\n"
            "• **Quiet Zones & Nap Areas**: Located inside the main venue for all overnight participants needing short rests.\n"
            "• **Dormitory Accommodation**: Gender-segregated dorms with floor wardens available for outstation participants who requested it during registration.\n"
            "• **What to Bring**: Basic bedding is provided; bring your personal toiletries, change of clothes, and college ID."
        )
        return msg, [{"document": "Innovate_AI_Hackathon_Rulebook_2026.md", "page": 3, "chunk_index": 4, "snippet": "Section 5.4: Accommodation — Gender-segregated dorms and venue nap areas."}]

    # 8. Complaints / Harassment / Safety
    if any(k in q_lower for k in ["bother", "harass", "complaint", "grievance", "safety", "emergency", "unfair", "dispute", "appeal"]):
        msg = (
            "🛡️ **Grievance, Conduct & Safety Resolution (Sections 3.5 & 6):**\n\n"
            "• **Zero-Tolerance Policy**: Harassment or misconduct results in immediate escalation/expulsion.\n"
            "• **How to Report**:\n"
            "  1. 🏢 **In-Person**: Visit the **24/7 Help Desk** (organizers with lanyards).\n"
            "  2. 🔒 **Confidential Form**: Use the confidential complaint form on the website if you prefer privacy.\n"
            "  3. 🚨 **Emergency Helpline**: Call the number printed on your badge for medical/safety emergencies.\n"
            "• **Scoring Disputes (Section 4.4)**: File a written appeal at the Help Desk within **1 hour** of results announcement. Chief Judge responds within 24 hours."
        )
        return msg, [{"document": "Innovate_AI_Hackathon_Rulebook_2026.md", "page": 4, "chunk_index": 5, "snippet": "Section 6: Complaints & Grievance Redressal & Escalation Matrix."}]

    # 9. Fun / Silly question: AI building itself
    if "build itself" in q_lower and ("sleep" in q_lower or "nap" in q_lower or "me" in q_lower):
        msg = (
            "🤖 **Nice try! But no.** 😄 (Section 3.4 & Section 10)\n\n"
            "While AI tools can generate code, you must be able to **explain, defend, and demonstrate every component** of your architecture during live judging. If an AI writes your project and you cannot explain it, judges will score it as unoriginal work!"
        )
        return msg, [{"document": "Innovate_AI_Hackathon_Rulebook_2026.md", "page": 5, "chunk_index": 7, "snippet": "Section 10 FAQs: Can my AI build itself and let me sleep?"}]

    # 10. Fun / Silly question: Unlimited Coffee
    if "unlimited coffee" in q_lower or "free coffee" in q_lower or "how much coffee" in q_lower:
        msg = (
            "☕ **Yes, coffee and tea are available continuously throughout the entire 36 hours!** (Section 5.3)\n\n"
            "Stay energized, hydrated, and hack responsibly! 🚀"
        )
        return msg, [{"document": "Innovate_AI_Hackathon_Rulebook_2026.md", "page": 5, "chunk_index": 7, "snippet": "Section 5.3 & Section 10: Continuous tea/coffee and refreshments provided."}]

    # 11. Prize Disbursement & Intellectual Property
    if any(k in q_lower for k in ["prize money", "disbursement", "when do we get money", "ip ownership", "own the code", "intellectual property", "certificate"]):
        msg = (
            "🏆 **Prizes, Certificates & IP Rights (Sections 7 & 8):**\n\n"
            "• **IP Ownership (Section 8.1)**: You retain **100% full intellectual property and ownership** rights to everything you build.\n"
            "• **Prize Disbursement (Section 7.2)**: Cash prizes are disbursed via bank transfer within **30 working days** (subject to ID/bank verification & statutory TDS tax).\n"
            "• **Certificates (Section 7.3)**: Digital Certificates of Participation are emailed to all valid submissions within **7 days**; winners receive Certificates of Achievement."
        )
        return msg, [{"document": "Innovate_AI_Hackathon_Rulebook_2026.md", "page": 4, "chunk_index": 6, "snippet": "Section 7.2 Prize Disbursement & Section 8.1 IP Ownership."}]

    return None, []

def generate_rag_answer(query: str, retrieved_chunks: List[Dict[str, Any]]) -> Tuple[str, List[Dict[str, Any]]]:
    """
    Generates a grounded RAG response tailored specifically to the user query and official rulebook.
    """
    # Check direct high-fidelity intent resolution first
    direct_ans, direct_sources = solve_direct_intents(query)
    if direct_ans:
        return direct_ans, direct_sources

    sources = []
    for chunk in retrieved_chunks:
        sources.append({
            "document": chunk.get("document_name", "Innovate_AI_Hackathon_Rulebook_2026.md"),
            "page": chunk.get("page_number", 1),
            "chunk_index": chunk.get("chunk_index", 0),
            "snippet": chunk["content"][:200] + ("..." if len(chunk["content"]) > 200 else "")
        })

    if not retrieved_chunks:
        refusal_msg = (
            "I could not find specific information regarding your query in the official Innovate AI Hackathon knowledge base.\n\n"
            "💡 **Next Steps**: You can reach out directly to the **24/7 Help Desk** at the venue, or submit a support ticket via the participant portal."
        )
        return refusal_msg, []

    # Dynamic semantic extraction matching the specific user question
    dynamic_answer = extract_dynamic_answer(query, retrieved_chunks)
    answer = f"**Based on the official Innovate AI Hackathon Rulebook & Participant Handbook:**\n\n{dynamic_answer}"

    return answer, sources
