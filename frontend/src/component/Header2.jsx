import '../App.css'
import novelBoxLogo from '../assets/image/novelBoxLogo.png'

export default function Header2() {
    return (
        <div style={{
            width: '100%',
            height: '4.2rem',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: '5rem',
            paddingRight: '5rem',
            boxSizing: 'border-box'
        }}>
            <div style={{ gap: 12, display: 'flex', alignItems: 'center' }}>
                <img
                    src={novelBoxLogo}
                    alt="logo"
                    style={{ width: '45px', height: '45px' }}
                />
                <h1 className='title0'>NOVEL BOX</h1>
            </div>

            <nav style={{ display: 'flex', gap: '20px', padding: '10px', alignItems: 'center' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#ff7474ff', cursor: 'default' }}>
                    創作中心
                </div>
            </nav>
        </div>
    );
}