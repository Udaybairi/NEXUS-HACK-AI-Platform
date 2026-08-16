from rag import get_retriever


def main():
    print("Starting RAG test...")

    retriever = get_retriever()

    questions = [
        "Is food free?",
        "What is the food menu?",
        "Can I use ChatGPT?",
        "What are the judging criteria?",
        "Can I participate alone?",
    ]

    for question in questions:
        print("\n" + "=" * 70)
        print("QUESTION:", question)
        print("=" * 70)

        documents = retriever.invoke(question)

        if not documents:
            print("No documents found.")
            continue

        for i, document in enumerate(documents, start=1):
            print(f"\n--- RESULT {i} ---")
            print(document.page_content[:1000])


if __name__ == "__main__":
    main()