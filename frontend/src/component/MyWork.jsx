import { useEffect, useState } from 'react'
import '../App.css'
import WorkCard from './WorkCard';
import WorkSpace from './WorkSpace';

export default function MyWork({ viewCount, setViewCount, user, tags, books, currentBook, setCurrentBook, setChapterTitle, setFrame, createChapter, handleReturnPage, refreshTrigger, setRefreshTrigger }) {
    const [page, setPage] = useState(1);

    const handleGoToEdit = (book) => {
        setPage(2);
        setCurrentBook(book);
    };
    useEffect(() => {
        if (currentBook && books.length > 0) {
            const updatedBook = books.find(b => b.novel_id === currentBook.novel_id);
            if (updatedBook) {
                setCurrentBook(updatedBook);
            }
        }
    }, [books]);

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 40, alignItems:'center'}}>
            {page === 1 && (
                <>
                    <p>我的作品</p>
                    <div style={{maxWidth: 1100, width:'100%', display:'flex', flexDirection:'column', gap: 20}}>
                        {books.map((book, index) => {
                            return (
                                <WorkCard
                                    key={index}
                                    data={book}
                                    action={() => handleGoToEdit(book)}
                                />
                            );
                        })}
                    </div>
                </>
            )}
            {page === 2 && <WorkSpace setPage2={setPage} tags={tags} data={currentBook} setChapterTitle={setChapterTitle} setFrame={setFrame} refreshTrigger={refreshTrigger} setRefreshTrigger={setRefreshTrigger} createChapter={createChapter} handleReturnPage={handleReturnPage} />}
        </div>
    )
}