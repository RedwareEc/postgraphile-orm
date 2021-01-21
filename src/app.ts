import Manifest from './manifest';

export const init = async () => {
  try {
    const server = await Manifest.initManifest();
    await Manifest.afterManifest(server);
    return server;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
