import { create, decryptMedia } from '@open-wa/wa-automate'
import chalk from 'chalk'

const SESSION_ID = "Losticarus";

(() => {
    create({
        headless: true,
        logFile: false,
        logConsole: false,
        qrTimeout: 0,
        sessionId: SESSION_ID
    }).then((client) => {
        console.log(chalk.blueBright("[LOSTICARUS] is alive!!"))

        client.onMessage(async (message) => {
            const uaOverride = `WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36`
            const { type, from, sender, isMedia, mimetype } = message
            let { pushname, verifiedName, formattedName } = sender
            console.log(`Message received from: ${from} type: ${type} mimetype: ${mimetype} isMedia: ${isMedia} sender: ${formattedName}`)
            if(isMedia && type == "image"){
                console.log(chalk.redBright("Sending sticker back"))
                await client.sendText(from, `_Processando..._`)
                const mediaData = await decryptMedia(message, uaOverride)
                const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                await client.sendImageAsSticker(from, imageBase64)
            }else if(isMedia && type == "video") {
                console.log(chalk.redBright("Sending video sticker back"))
                await client.sendText(from, `_Processando..._`)
                const mediaData = await decryptMedia(message, uaOverride)
                const videoBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                await client.sendMp4AsSticker(from, videoBase64)
            }else{
                console.log(chalk.redBright(`Sending message back`))
                await client.sendText(from, `Mande uma imagem ou video, filho... Sei fazer *CARALHA* nenhuma com texto!`)
            }
        })
    }).catch((err) => console.error(err))
})();