import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();

const port = 8080;

// 현재 파일의 URL에서 디렉토리 경로를 추출
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.redirect('/html/index.html');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    // server.js

    const os = require('os');

    // 환경 변수에서 호스트 이름을 가져오거나 기본값으로 'localhost' 사용
    const host = process.env.HOST || 'localhost';

    // os 모듈을 사용하여 시스템 호스트 이름 가져오기
    const hostname = os.hostname();

    console.log(`Server host (environment variable): ${host}`);
    console.log(`Server host (os module): ${hostname}`);

});
