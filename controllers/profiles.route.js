const express = require('express');

const router = express.Router();

const profilesRepository = require('../utils/profiles.repository');
const rentsRepository = require('../utils/rents.repository');
const { adminRightsCheck } = require('../utils/middlewares');

router.get('/list', adminRightsCheck, listAllProfiles);
router.get('/me', showCurrentUserProfile);
router.get('/:profileId', adminRightsCheck, showProfileById);

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

async function showCurrentUserProfile(req, res){
    const id = req.session.user.profileID;
    const profile = await profilesRepository.getProfileById(id);
    res.render("profiles/current_user_profile", {profile: profile[0]});
}


module.exports = router;