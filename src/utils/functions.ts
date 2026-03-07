import { axiosInstance } from "../config";
import { faker } from "@faker-js/faker";

export const onGenerateTodos = async (
  jwt: string,
  setIsGenerating: (value: boolean) => void,
  setQueryVersion?: (value: number | ((prev: number) => number)) => void,
) => {
  setIsGenerating(true);
  for (let index = 0; index < 100; index++) {
    try {
      await axiosInstance.post(
        `/todos`,
        {
          data: {
            title: faker.word.words(5),
            description: faker.lorem.sentences(3),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );
    } catch (error) {
      console.log(error);
    }
  }
  setIsGenerating(false);
  if (setQueryVersion) {
    setQueryVersion((prev) => prev + 1);
  }
};
