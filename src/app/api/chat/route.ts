import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from root folder
dotenv.config({ path: path.join(process.cwd(), '.env') });

// Also load from system environment variables as fallback
dotenv.config();

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message, persona } = await request.json();
    
    console.log('API called with:', { message, persona });
    console.log('API Key exists:', !!process.env.OPENAI_API_KEY);
    console.log('API Key length:', process.env.OPENAI_API_KEY?.length || 0);
    console.log('Environment variables loaded:', Object.keys(process.env).filter(key => key.includes('OPENAI')).length);
    
    // Read the persona-specific system prompt
    let systemPrompt = "";
    
    if (persona === "hitesh") {
      try {
        const filePath = path.join(process.cwd(), "dataset", "hitesh.md");
        console.log('Reading Hitesh file from:', filePath);
        systemPrompt = fs.readFileSync(filePath, "utf-8");
        console.log('Hitesh system prompt length:', systemPrompt.length);
      } catch (fileError) {
        console.error('Error reading Hitesh file:', fileError);
        systemPrompt = "You are Hitesh Choudhary, a tech educator and content creator.";
      }
    } else if (persona === "piyush") {
      try {
        const filePath = path.join(process.cwd(), "dataset", "piyush.md");
        console.log('Reading Piyush file from:', filePath);
        
        // Try different encoding methods
        let fileContent = "";
        try {
          // First try UTF-8
          fileContent = fs.readFileSync(filePath, "utf-8");
        } catch (encodingError) {
          try {
            // Try without encoding specification
            fileContent = fs.readFileSync(filePath).toString();
          } catch (fallbackError) {
            // Try with buffer
            const buffer = fs.readFileSync(filePath);
            fileContent = buffer.toString('utf-8');
          }
        }
        
        console.log('Raw file content length:', fileContent.length);
        console.log('Raw file content preview:', fileContent.substring(0, 200));
        
        // Clean the content - remove any BOM or special characters
        systemPrompt = fileContent.trim();
        
        if (systemPrompt.length > 0) {
          console.log('✅ Using Piyush system prompt from file');
          console.log('Cleaned content length:', systemPrompt.length);
        } else {
          console.log('❌ Piyush file appears empty after cleaning');
          systemPrompt = "You are Piyush Garg, a tech mentor and software engineer. You specialize in system design, backend development, and helping developers understand complex technical concepts. You provide practical, hands-on guidance and focus on real-world applications.";
        }
      } catch (fileError) {
        console.error('Error reading Piyush file:', fileError);
        systemPrompt = "You are Piyush Garg, a tech mentor and software engineer. You specialize in system design, backend development, and helping developers understand complex technical concepts.";
      }
    }

    console.log('Final system prompt length:', systemPrompt.length);
    console.log('Making OpenAI request...');
    
    // Validate API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is missing');
      return NextResponse.json({ 
        error: 'Configuration error',
        details: 'OpenAI API key is not configured'
      }, { status: 500 });
    }
    
    const response = await openai.chat.completions.create({
      model: "openai/gpt-oss-20b:free",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    console.log('OpenAI response received');
    console.log('Response structure:', JSON.stringify(response, null, 2));
    
    // Validate response structure
    if (!response || !response.choices || !Array.isArray(response.choices) || response.choices.length === 0) {
      console.error('Invalid response structure:', response);
      return NextResponse.json({ 
        error: 'Invalid response from AI service',
        details: 'Response does not contain expected choices array'
      }, { status: 500 });
    }
    
    const firstChoice = response.choices[0];
    if (!firstChoice || !firstChoice.message || !firstChoice.message.content) {
      console.error('Invalid choice structure:', firstChoice);
      return NextResponse.json({ 
        error: 'Invalid response from AI service',
        details: 'Choice does not contain expected message content'
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      response: firstChoice.message.content 
    });
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json({ 
      error: 'Failed to get response',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
