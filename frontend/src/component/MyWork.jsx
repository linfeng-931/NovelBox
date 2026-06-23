import { useEffect, useState } from 'react'
import '../App.css'
import { handleGetBooksByAuth } from '@/utils/linkDB';
import WorkCard from './WorkCard';
import WorkSpace from './WorkSpace';

export default function MyWork({ user, tags, currentBook, setCurrentBook, setChapterTitle, setFrame, createChapter, handleReturnPage, refreshTrigger, setRefreshTrigger }) {
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(1);

    const handleGoToEdit = (book) => {
        setPage(2);
        setCurrentBook(book);
    };

    useEffect(() => {
        handleGetBooksByAuth(setBooks, user.user_id).catch(err => console.log("撈取作品失敗：", err));
    }, [user.user_id, refreshTrigger]);

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 40 }}>
            {page === 1 && (
                <>
                    <p>我的作品</p>
                    {books.map((book, index) => {
                        return (
                            <WorkCard
                                key={index}
                                data={book}
                                action={() => handleGoToEdit(book)}
                            />
                        );
                    })}
                </>
            )}
            {page === 2 && <WorkSpace data={currentBook} setChapterTitle={setChapterTitle} setFrame={setFrame} refreshTrigger={refreshTrigger} setRefreshTrigger={setRefreshTrigger} createChapter={createChapter} handleReturnPage={handleReturnPage} />}
        </div>
    )
}