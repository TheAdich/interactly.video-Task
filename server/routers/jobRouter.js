const router=require('express').Router();
const {createJob,deleteJob,jobById,getAllJobs,appliedJobs,getAllCandidate}=require('../controllers/jobController')
router.post('/createJob',createJob);
router.post('/deleteJob',deleteJob);
router.get('/getById',jobById);
router.get('/getAllJobs/:id',getAllJobs);
router.get('/appliedJobs/:id',appliedJobs);
router.get('/getAllCandidate',getAllCandidate);
module.exports=router;