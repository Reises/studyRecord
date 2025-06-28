import { useEffect, useState} from "react";
import { Button, Container, IconButton, TextField, Typography, Stack, Alert, Card, CardContent, List, LinearProgress, ListItem, ListItemText } from "@mui/material";
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
    const [isInitialized, setIsInitialized] = useState(false);  //  ローカルストレージで保存した値がsaveLocalStorage()が呼ばれることにより、表示されない問題があるため、フラグで呼ばないようにする

    const storage = localStorage;   //  ストレージをlocalStorageに設定

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

    //  ローカルストレージ保存機能
    const saveLocalStorage = () => {
        storage.setItem("study", JSON.stringify(study));
        storage.setItem("time", time);
        storage.setItem("nextId", nextId);  //  ページリロード時、nextIdが被ったり、そもそも登録した内容が表示されないため
    }

    //  ローカルストレージから取得
    const getLocalStorage = () => {
        const studyList = storage.getItem("study") || '[]';   //  ローカルストレージに値がない場合、文字列型の空の配列を取得
        const studyTime = storage.getItem("time") || '0';   //  ローカルストレージに値がない場合、文字列型の0を取得
        setStudy(JSON.parse(studyList));
        setTime(parseFloat(studyTime));
        nextId = parseInt(localStorage.getItem("nextId")) || 0; //  ローカルストレージに値がない場合、0を取得
        setIsInitialized(true);
    }

    useEffect(() => {
        getLocalStorage();
    }, []);

    useEffect(() => {
        if (isInitialized === true) {
            saveLocalStorage();
        }
    }, [study, time]);
    
    return  (
        <>
            <Container maxWidth="sm" sx={{ mt: 4, mb: 4}}>
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
                    入力されている時間：{num}時間
                </Typography>
                <Button variant="contained" color="primary" onClick={handleRegister}>登録</Button>
                {/* <Alert>{errorMessage}</Alert> */}
                {/* エラーメッセージがあるときだけ表示 */}
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            </Stack>
            {study.length === 0 ? (
                <Typography color="text.secondary">まだ記録がありません</Typography>
            ) : (
                <Card sx={{ mt: 3, mb: 3}}>
                    <CardContent>
                        <Typography variant="h6">学習記録</Typography>
                        <List>
                            {study.map(item => (
                                <ListItem key={item.id}>
                                    <ListItemText primary={`${item.title}(${item.duration}時間)`} />
                                    <IconButton onClick={() => handleRemove(item.id, item.duration)} aria-label="削除"><DeleteIcon /></IconButton>
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            )}
            {/* 時間の進捗をプログレスバー表示 */}
            <LinearProgress variant="determinate" value={(time / 1000) * 100} sx={{ mt: 3, mb: 3}} />
            <Typography variant="body2"> 合計時間:{time} / 1000(h) </Typography>
            </Container>
        </>
    )
}

