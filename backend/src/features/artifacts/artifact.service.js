import Artifact from "./artifact.model.js";
import * as archiverPkg from "archiver";
const archiver = archiverPkg.default || archiverPkg;

export const artifactService = {
  async getProjectArtifacts(projectId, userId) {
    return await Artifact.find({ project: projectId, owner: userId }).sort({ file_path: 1 });
  },

  async getArtifact(artifactId, userId) {
    const artifact = await Artifact.findOne({ _id: artifactId, owner: userId });
    if (!artifact) throw new Error("Artifact not found");
    return artifact;
  },

  async updateArtifact(artifactId, userId, updates) {
    const artifact = await Artifact.findOneAndUpdate(
      { _id: artifactId, owner: userId },
      { $set: updates },
      { new: true }
    );
    if (!artifact) throw new Error("Artifact not found");
    return artifact;
  },

  async createOrUpdateArtifact(projectId, userId, filePath, content, fileType = "markdown") {
    return await Artifact.findOneAndUpdate(
      { project: projectId, owner: userId, file_path: filePath },
      { $set: { content, file_type: fileType } },
      { new: true, upsert: true }
    );
  },

  async exportArtifactsZip(projectId, userId, res) {
    const artifacts = await Artifact.find({ project: projectId, owner: userId });
    
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename=project-${projectId}-artifacts.zip`);

    const archive = archiver("zip", {
      zlib: { level: 9 } // Sets the compression level.
    });

    archive.on("error", (err) => {
      throw err;
    });

    archive.pipe(res);

    for (const artifact of artifacts) {
      archive.append(artifact.content, { name: artifact.file_path });
    }

    await archive.finalize();
  }
};
