import { useState} from "react";
import { Button, Container, IconButton, TextField, Typography, Stack, Alert } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

let nextId = 0;

export default function StudyRecord() {
    //  入力値(title)、学習内容(study)をstateで管理
    const [title, setTitle] = useState('');
    const [study, setStudy] = useState([]);
    //  入力値(num)、学習時間(time)をstateで管理
    const [num, setNum] = useState(''); //  inputからの値は文字列
    const [time, setTime] = useState(0);
    const [errorMessage, setErrorMessage] = useState(''); // エラーメッセージ用のstate

    const handleRegister = () => {
        const trimmedTitle = title.trim();
        const parsedNum = parseFloat(num);

        //  バリデーション
        if (trimmedTitle === "") {
            setErrorMessage('学習内容が入力されていません。')
            return;
        }
        if (num.trim() === "" || isNaN(parsedNum) || parsedNum <= 0) {
            setErrorMessage('学習時間が入力されていません。')
            return;
        }

        //  登録処理
        setStudy([
            ...study,
            { id: nextId++, title: title, duration: parsedNum }
        ]);
        // 既存の時間に新しい学習時間を加算（数値として処理）
        setTime(prevTime => prevTime + parsedNum);

        //  フォームリセット
        setTitle('');
        setNum('');
        setErrorMessage('');
    }

    //  削除処理
    const handleRemove = (idToRemove, durationToRemove) => {
        setStudy(study.filter((item) => item.id !== idToRemove));
        setTime(prevTime => prevTime - durationToRemove);
    }
    return  (
        <>
            <Container maxWidth="sm">
                <Typography variant="h4" align="center" gutterBottom>
                    学習記録一覧
                </Typography>
            <Stack spacing={1}>
                <TextField label="学習内容" margin="normal" value={title} onChange={e => setTitle(e.target.value)} />
                <TextField label="学習時間" margin="normal" value={num} onChange={e => setNum(e.target.value)} />
                <Typography variant="body1">
                    入力されている学習内容:{title}
                </Typography>
                <Typography variant="body1">
                    <p>入力されている時間：{num}時間</p>
                </Typography>
                <Button variant="contained" onClick={handleRegister}>登録</Button>
                {/* <Alert>{errorMessage}</Alert> */}
                {/* エラーメッセージがあるときだけ表示 */}
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            </Stack>
            <ul>
                {study.map(item => (
                    <li key={item.id}>{`${item.title}(${item.duration}時間)`}
                    <IconButton onClick={() => handleRemove(item.id, item.duration)} aria-label="削除"><DeleteIcon /></IconButton></li>
                ))}
            </ul>
            <Typography variant="body1">
                <p>合計時間:{time} / 1000(h)</p>
            </Typography>
            </Container>
        </>
    )
}

