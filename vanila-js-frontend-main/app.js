import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();

const port = 443;

// 현재 파일의 URL에서 디렉토리 경로를 추출
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.redirect('/html/index.html');
});

const server = app.listen(port, () => {
    console.log(`${server.address().address}`)
    console.log(`Server is running on port ${port}`);
});
