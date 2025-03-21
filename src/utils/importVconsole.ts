import VConsole from 'vconsole'

const importVconsole = () => {
  if (import.meta.env.PROD && import.meta.env.MODE === 'dev') {
    const vConsole = new VConsole()
    console.log(vConsole.version)
  }
}

export default importVconsole
