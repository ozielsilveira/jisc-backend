import { VercelRequest, VercelResponse } from '@vercel/node';

let appPromise: Promise<any> | null = null;

async function getApp() {
    if (!appPromise) {
        const importPath = process.env.NODE_ENV === 'production' ? '../dist/index.js' : '../src/index';
        appPromise = import(/* @vite-ignore */ importPath).then((m) => m.default ?? m);
    }
    return appPromise;
}

export default async (req: VercelRequest, res: VercelResponse) => {
    // Ensure cors headers are set
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const app = await getApp();
    return app(req, res);
};

