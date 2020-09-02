import Glue from '@hapi/glue';
import manifest from './config/manifest';

const composeOptions = {
  relativeTo: __dirname,
};
export const init = async () => {
  try {
    const server = await Glue.compose(manifest, composeOptions);

    return server;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
