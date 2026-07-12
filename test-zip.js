import fs from 'fs';
import mongoose from 'mongoose';
import * as archiverPkg from "archiver";
import Artifact from './backend/src/features/artifacts/artifact.model.js';

async function test() {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/laughing-giggle");
  const projectId = "6690fa5b2f15a31b6df07b9a"; // Wait, I don't know a projectId. Let's just mock it.
}
