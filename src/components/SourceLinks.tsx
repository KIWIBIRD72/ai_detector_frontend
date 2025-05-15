import { FC } from "react";

type SourceLinksProps = {};
export const SourceLinks: FC<SourceLinksProps> = (props) => {
  return (
    <div className="mb-4 flex flex-col gap-2">
      <a
        className="text-blue-600 underline"
        target="_blank"
        href="https://huggingface.co/datasets/HumanLLMs/Human-Like-DPO-Dataset"
      >
        Ссылка на датасет hugging face
      </a>
      <a
        className="text-blue-600 underline"
        target="_blank"
        href="https://github.com/KIWIBIRD72/ai_detector"
      >
        GitHub репозиторий проекта
      </a>
    </div>
  );
};
