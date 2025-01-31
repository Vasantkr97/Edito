import { NextApiRequest, NextApiResponse } from "next";
import { saveExecution } from "@/src/db/codeExecution";
import { NextResponse } from "next/server";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
   
    try {
        const { language, code, output, error } = await req.body;
        console.log("In Server",language);
        console.log("In Server",code)
        console.log("In Server",output);
        console.log("In Server",error)
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