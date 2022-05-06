import { prisma } from './prisma';
import nodemailer from 'nodemailer'
import express from 'express';

const app = express();

/* METHODS: GET, POST, PUT, PACTH, DELETE
GET    = BUSCAR INFORMAÇÕES
POST   = CADASTRAR INFORMAÇÕES
PUT    = ATUALIZAR INFORMAÇÕES DE UMA ENTIDADE
PATCH  = ATUALZIAR UMA INFORMAÇÃO ÚNICA DE UMA ENTIDADE
DELETE = DELETAR UMA INFORMAÇÃO
*/
app.use(express.json());

const transport = nodemailer.createTransport({
	host: "smtp.mailtrap.io",
	port: 2525,
	auth: {
		user: "1f2bcd96311083",
		pass: "9d3e8888cb04ab"
	}
});

app.post('/feedbacks', async(req, res) => {
	const {type,comment,screenshot} = req.body

	const feedback = await prisma.feedback.create({
		data:{
			type: type,
			comment: comment,
			screenshot: screenshot,
		}
	})

  await	transport.sendMail({
		from: 'Equipe Feedget <oi@feedget.com>',
		to: 'Larissa Franco <larissacfranco@gmail.com>',
		subject: 'Novo feedback',
		html: [
			`<div> style="font-family: sans-serif; font-size:16px; color: #111;`,
			`<p>Tipo do feedback: ${type}</p>`,
			`<p>Comentário: ${comment}</p>`,
			`</div>`
		].join('\n')
	});

	return res.status(201).json({ data: feedback});
})

app.listen(3333, () => {
	console.log('HTTP server running!');
});