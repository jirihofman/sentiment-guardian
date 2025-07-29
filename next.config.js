const nextConfig = {
    images: {
        dangerouslyAllowSVG: true,
        domains: [
            // Avatar icons from different Next-auth providers. Icons for included software.
            'github.githubassets.com',
            'github.com',
            'avatars.githubusercontent.com',
            'camo.githubusercontent.com',
            'raw.githubusercontent.com',
            'lh3.googleusercontent.com',
            'cdn-icons-png.flaticon.com',
        ],
    },
    reactStrictMode: true
};
export default nextConfig;
