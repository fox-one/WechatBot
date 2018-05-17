// import { Wechaty, Room, Contact, config, Message } from "wechaty"
const { Wechaty, Room ,Contact, config, Message, MsgType} = require('wechaty')
const axios = require('axios')

bot = Wechaty.instance({ profile: config.default.DEFAULT_PROFILE })
const bot_config = require('config.json')

bot
	.on('scan', (url, code) => {
		if (!/201|200/.test(String(code))) {
			const loginUrl = url.replace(/\/qrcode\//, '/l/')
			require('qrcode-terminal').generate(loginUrl)
		}
	})

	.on('login', (user) => {
        console.log(`${user} login`)
	})

	// .on('friend', async function (contact, request) {
	// 	if (request) {
	// 		await request.accept()
	// 	}
	// })

	.on('message', (m) => {
		const contact = m.from()
		const content = m.content()
		const room = m.room()

		if (m.type() != MsgType.TEXT) {
			return
        }
        
        if (room) {
            const payload = {
                "message_content" : content,
                "nickname"        : contact.name(),
                "group_name"      : room.topic(),
                "timestamp"       : Date.now()
            }

            axios.post(bot_config.url, payload)
        }
	})

    .start()
    .catch(e => console.error(e))
