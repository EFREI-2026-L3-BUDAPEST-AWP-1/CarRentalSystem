const express = require('express');

const router = express.Router();

const profilesRepository = require('../utils/profiles.repository');
const rentsRepository = require('../utils/rents.repository');

router.get('/list', listAllProfiles);
router.get('/:profileId', showProfileById);

async function listAllProfiles(req, res){
    try {
        const profiles = await profilesRepository.getAllProfiles();
        console.log(profiles);
        res.render("profiles/list", { profiles });
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

async function showProfileById(req, res){
    try {
        const id = req.params.profileId;
        const profile = await profilesRepository.getProfileById(id);
        const rentsOfProfile = await rentsRepository.getRentsByProfileId(id);
        console.log(profile);
        console.log(rentsOfProfile);
        res.render("profiles/show", { profile: profile[0], rentsOfProfile });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}

module.exports = router;
