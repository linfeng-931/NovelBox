export default function WriterLevelLabel({ level, currentLevel }) {
    return (
        <>
            {currentLevel === 0 &&
                <div style={{ display: 'inline-block', backgroundColor: '#EEE3DB', borderRadius: 8, padding: '2px 20px' }}>
                    <p className="content1" style={{ color: '#603B00', fontSize: 12}}>
                        {level[0]?.name}
                    </p>
                </div>
            }
            {currentLevel === 1 &&
                <div style={{ display: 'inline-block', backgroundColor: '#E7F1F4', borderRadius: 8, padding: '2px 20px' }}>
                    <p className="content1" style={{ color: '#7F7F7F', fontSize: 12}}>
                        {level[1]?.name}
                    </p>
                </div>
            }
            {currentLevel === 2 &&
                <div style={{ display: 'inline-block', backgroundColor: '#FFF0C6', borderRadius: 8, padding: '2px 20px' }}>
                    <p className="content1" style={{ color: '#C1811B', fontSize: 12}}>
                        {level[2]?.name}
                    </p>
                </div>
            }
        </>
    );
}