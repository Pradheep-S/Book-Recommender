export default function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "https://bookrecc.vercel.app");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    return res.next();
}
