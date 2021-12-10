const bucket = gridFS.createBucket({bucketName:'csv'})
		const filename = req.file.path;
		const readStream = fs.createReadStream(filename);
		bucket.writeFile({ filename:req.file.filename }, readStream)
		const chunk = await bucket.findOne({filename:req.file.originalname})
		const File = gridFS.createModel({bucketName:'csv'});
		await File.findById(chunk._id, (error, attachment) => {
			const readstream = attachment.read();
			let csvData=[];
			readstream.pipe(csv({separator: ';'}))
				.on('data', function(csvrow) {
					csvData.push(csvrow);
				})
				.on('end',function() {
					//do something with csvData
					console.log(csvData);
				});
		});