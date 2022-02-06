Moralis.Cloud.define("checkAddress", async function (request) {
	const query = new Moralis.Query("User");
	query.equalTo("ethAddress", request.params.ethAddress)
	const results = await query.find({ useMasterKey: true });
	return results;
});

/*
Moralis.Cloud.define("updateUser", async function (request) {
  const User = Moralis.Object.extend("User");
const query = new Moralis.Query(User);
	query.equalTo("ethAddress", request.params.ethAddress)
  
	const results = await query.find({useMasterKey:true});
  logger.info('-------------',JSON.stringify(results))
  if (results){
	results[0].set("reward", "test123");
	await results[0].save(null, { useMasterKey: true })
	return results[0];
  } else {
	return {"status":"err","msg":"cannot find user"};
  }
});*/

Moralis.Cloud.define("updateUserProfile", async (request) => {

	request.user.set("profile", request.params.profile);
	await request.user.save(null, { useMasterKey: true });
	return request.user;

}, {
	requireUser: true,
	useMasterKey: true
});

Moralis.Cloud.define("getProfile", async (request) => {

	return request.user.attributes.profile;

}, {
	requireUser: true,
	useMasterKey: true
});

Moralis.Cloud.define("getBids", async (request) => {
	const query = new Moralis.Query('bidsAccepted');
	query.equalTo("tokenId", request.params.tokenId);
	query.equalTo("nftContract", request.params.nftContract);

	const results = await query.find({ useMasterKey: true });

	return results;

});