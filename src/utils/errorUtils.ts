export const handleError = (error: unknown, context: string = "Unexpected Error") => {
    if (error instanceof Error) {
        console.error(`[${context}] ${error.message}`);
    } else {
        console.error(`[${context}]`, error);
    }
};
