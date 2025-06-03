import { yup } from "~/server/libs/yup";

export const createTopicSchema = () =>
  yup.object({
    titulo: yup.string().required(),
  });

export const uploadPaperSchema = () =>
  yup.object({
    topicId: yup.string().required(),
    pdfFile: yup.mixed().required(),
  });