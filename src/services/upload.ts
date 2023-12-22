import multer from 'multer';
// @ts-ignore
import SharpMulter from "sharp-multer";


const imageUploader = multer({
	storage: SharpMulter({
		imageOptions: {
			fileFormat: "webp",
			resize: { width: 1024, height: 1024, resizeMode: "inside" },
		},
		destination: (req: any, file: any, callback: any) => callback(null, "content/images"),
		filename: (originalname: any, options: any, req: ApiRequest) => {
			return `${req.auth!.id}-${Date.now()}.${options.fileFormat}`;
		}
	})
});

export const parseImage = (name: string) => imageUploader.single(name);