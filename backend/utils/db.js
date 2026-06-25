import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import {neon} from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);
const [result] = await sql`SELECT version()`;
const count = await sql`SELECT COUNT(*) FROM users`;
const version = result?.version || 'No version found';
console.log(`Connected to database. Version: ${version}`);
console.log(`Number of users in the database: ${count[0].count}`);
export default sql;