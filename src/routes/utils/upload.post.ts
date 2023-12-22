
export async function upload(req: ApiRequest, res: ApiResponse) {
	res.json({
		path: req.file!.path,
		state: "success",
	});
}