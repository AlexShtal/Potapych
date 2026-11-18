import { writeFile } from 'node:fs/promises';
import { readFile } from 'node:fs/promises';

const intervalDays = Number(process.env.BINGO_INTERVAL_DAYS || 7);
if (!Number.isInteger(intervalDays) || intervalDays < 1) throw new Error('BINGO_INTERVAL_DAYS must be a positive integer');
let phrases;
try { phrases = process.env.BINGO_PHRASES ? JSON.parse(process.env.BINGO_PHRASES) : JSON.parse(await readFile('phrases.json', 'utf8')); }
catch { throw new Error('BINGO_PHRASES must be a JSON array of strings'); }
if (!Array.isArray(phrases) || phrases.some((phrase) => typeof phrase !== 'string' || !phrase.trim())) throw new Error('BINGO_PHRASES must be a JSON array of non-empty strings');
if (phrases.length < 2) throw new Error('Add at least 2 phrases to BINGO_PHRASES');
const config = { intervalDays, phrases, supabaseUrl: process.env.SUPABASE_URL || '', supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '' };
await writeFile('config.js', `window.BINGO_CONFIG = ${JSON.stringify(config)};\n`);
