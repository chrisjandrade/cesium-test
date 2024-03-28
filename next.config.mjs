/** @type {import('next').NextConfig} */

const nextConfig = {
    webpack: (config, { webpack }) => {
        const cesiumPlugin = new webpack.DefinePlugin({ CESIUM_BASE_URL: JSON.stringify('cesium') });

        config.plugins.push(cesiumPlugin);
        return config;
    }
};

export default nextConfig;
