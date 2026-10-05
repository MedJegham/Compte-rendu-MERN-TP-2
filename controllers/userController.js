const { estNonVide, estEmailValide } = require('../utils/validators');

// Données isolées dans le contrôleur (en mémoire pour cette séance)
let users = [
    {
        id: 1,
        name: "Mohamed Jegham",
        email: "mohamed@gmail.com",
        role: "admin"
    },
    {
        id: 2,
        name: "Aya",
        email: "aya@gmail.com",
        role: "user"
    }
];
let prochainId = 3;

// 1. Récupérer tous les utilisateurs (avec filtre optionnel ?role=...)
const getAllUsers = (req, res) => {
    const { role } = req.query;

    let resultat = users;

    if (role) {
        resultat = users.filter(u => u.role === role);
    }

    res.status(200).json({
        total: resultat.length,
        users: resultat
    });
};

// 2. Récupérer un utilisateur par son ID unique
const getUserById = (req, res) => {
    const id = Number(req.params.id);

    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({
            error: `Utilisateur ${id} introuvable`
        });
    }

    res.status(200).json(user);
};

// 3. Créer un nouvel utilisateur (name et email obligatoires)
const createUser = (req, res) => {
    const { name, email, role } = req.body;

    if (!estNonVide(name)) {
        return res.status(400).json({
            error: "Le nom est obligatoire et ne doit pas être vide"
        });
    }

    if (!estEmailValide(email)) {
        return res.status(400).json({
            error: "L'email est obligatoire et doit contenir '@' et '.'"
        });
    }

    const nouvelUser = {
        id: prochainId++,
        name: name.trim(),
        email: email,
        role: role || "user"
    };

    users.push(nouvelUser);

    res.status(201).json({
        message: "Utilisateur créé",
        user: nouvelUser
    });
};

// 4. Supprimer un utilisateur (DELETE /api/users/:id)
const deleteUser = (req, res) => {
    const id = Number(req.params.id);

    const userExiste = users.some(u => u.id === id);

    if (!userExiste) {
        return res.status(404).json({
            error: `Impossible de supprimer : utilisateur ${id} introuvable`
        });
    }

    users = users.filter(u => u.id !== id);

    res.status(200).json({
        message: `Utilisateur ${id} supprimé avec succès`
    });
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    deleteUser
};
