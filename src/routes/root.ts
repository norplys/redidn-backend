import type { Router } from 'express';

export default function (app: Router) {
    app.get('/', (_req, res) => {
        res.status(200).json({
            message: 'Welcome to the API'
        });
    });
}