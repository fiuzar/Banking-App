"use server"

import { query } from "@/dbh"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    // 1. Create Users Table
    const createUserTable = `
      CREATE TABLE IF NOT EXISTS paysense_users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT,
        image TEXT,
        verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 2. Create OTP Table
    const createOtpTable = `
      CREATE TABLE IF NOT EXISTS paysense_verify_email (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        pin VARCHAR(6) NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await query(createUserTable);
    await query(createOtpTable);

    console.log("Database tables initialized successfully");

    return NextResponse.json({ success: true, message: "Tables created successfully" });
  } catch (error) {
    console.error("Error creating tables:", error);
    return NextResponse.json({ success: false, message: error.message });
  }
}