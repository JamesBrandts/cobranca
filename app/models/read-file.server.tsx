

export async function getFile(filename: string) : Promise<any> {
    const fs = require('fs');
    const path = require('path');
    const file = path.join(process.cwd(), `/public/uploads/${filename}`);
    try {
        return fs.readFileSync(file, 'utf8');
    } catch (err) {
        console.error(err);
    }
}
