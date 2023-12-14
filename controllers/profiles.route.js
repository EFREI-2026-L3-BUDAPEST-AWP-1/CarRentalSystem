const express = require('express');

const router = express.Router();

const profilesRepository = require('../utils/profiles.repository');
const rentsRepository = require('../utils/rents.repository');
const { adminRightsCheck } = require('../utils/middlewares');

router.get('/list', adminRightsCheck, listAllProfiles);
router.get('/:profileId', showProfileById);

async function listAllProfiles(req, res){
    const profiles = await profilesRepository.getAllProfiles();
    console.log(profiles);
    res.render("profiles/list", {profiles});
}

async function showProfileById(req, res){
    const id = req.params.profileId;
    const profile = await profilesRepository.getProfileById(id);
    const rentsOfProfile = await rentsRepository.getRentsByProfileId(id);
    console.log(profile);
    console.log(rentsOfProfile);
    res.render("profiles/show", {profile: profile[0], rentsOfProfile});
}


module.exports = router;