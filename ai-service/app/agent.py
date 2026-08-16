from deepagents import create_deep_agent
from langchain_core.tools import tool
from app.rag import get_retriever

@tool
def hackathon_rulebook_search(query: str) -> str:
    """Search for information about the Innovate AI Hackathon rules, logistics, schedule, prizes, judging, and registration."""
    retriever = get_retriever()
    docs = retriever.invoke(query)
    return "\n\n".join([doc.page_content for doc in docs])

def get_agent():
    retriever_tool = hackathon_rulebook_search


    system_prompt = (
        "You are a helpful AI chatbot assistant for the Innovate AI Hackathon website. "
        "Your job is to answer participant questions about rules, eligibility, registration, schedule, venue, "
        "food, accommodation, judging criteria, submissions, prizes, teams, deadlines, and logistics.\n\n"
        "You MUST use the 'hackathon_rulebook_search' tool to find the official answers from the rulebook.\n"
        "If the information is NOT present in the official document, DO NOT hallucinate. Instead, respond with: "
        "'I couldn't find that information in the official hackathon information. Please contact the organizing team for confirmation.'\n\n"
        "Keep your answers concise and directly to the point. Do not make up any policies not stated in the rulebook."
    )

    agent = create_deep_agent(
        model="google_genai:gemini-3.5-flash",
        tools=[retriever_tool],
        system_prompt=system_prompt
    )

    return agent
