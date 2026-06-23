export default function WriterLevelLabel({ user, level }) {

    const currentLevel = () => {
        if (!level || level.length < 3) return 0;

        const exp = user?.writer_exp || 0;

        if (exp >= level[2].min_exp) {
            return 2;
        } else if (exp >= level[1].min_exp) {
            return 1;
        } else {
            return 0;
        }
    };

    if (!level || level.length === 0) {
        return <p className="tag1">計算中...</p>;
    }

    return (
        <>
            {currentLevel() === 0 &&
                <div style={{ display: 'inline-block', backgroundColor: '#EEE3DB', borderRadius: 8, padding: '5px 25px' }}>
                    <p className="content1" style={{ color: '#603B00'}}>
                        {level[0]?.name}
                    </p>
                </div>
            }
            {currentLevel() === 1 &&
                <div style={{ display: 'inline-block', backgroundColor: '#E7F1F4', borderRadius: 8, padding: '5px 25px' }}>
                    <p className="content1" style={{ color: '#7F7F7F'}}>
                        {level[1]?.name}
                    </p>
                </div>
            }
            {currentLevel() === 2 &&
                <div style={{ display: 'inline-block', backgroundColor: '#FFF0C6', borderRadius: 8, padding: '5px 25px' }}>
                    <p className="content1" style={{ color: '#C1811B'}}>
                        {level[2]?.name}
                    </p>
                </div>
            }
        </>
    );
}