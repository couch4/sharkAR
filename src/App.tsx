import {useState } from 'react'
import { ZapparCanvas, BrowserCompatibility } from '@zappar/zappar-react-three-fiber';
import { ResizeObserver } from '@juggle/resize-observer';
import { Scene } from './components'

const App = () => {
    const [start,setStart] = useState(false)
    return (
        <>
            <BrowserCompatibility />
            <ZapparCanvas resize={{ polyfill: ResizeObserver }} shadowMap>
            <Scene />
            </ZapparCanvas>
        </>
    )
}

export default App;
