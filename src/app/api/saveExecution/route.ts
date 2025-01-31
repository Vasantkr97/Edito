import { saveExecution } from "@/src/db/codeExecution";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
   
    try {
        const { language, code, output, error } = await req.json();
        const result = await saveExecution({
            language,
            code,
            output: output || "",
            error: error || "",
        });

        return NextResponse.json(result, { status: 200 })
    } catch (error) {
        console.log("Error saving Execution:", error);
        return NextResponse.json({ error: "Failed to save execution"}, { status: 500})
    }
    
}