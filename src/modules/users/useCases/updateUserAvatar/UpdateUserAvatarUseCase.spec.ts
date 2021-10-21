import { mock } from "jest-mock-extended";

import { IStorageProvider } from "../../../../shared/container/providers/StorageProvider/IStorageProvider";
import { AuthenticationError } from "../../../../shared/errors/AuthenticationError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { NoAvatarFileError } from "./errors/NoAvatarFileError";
import { UpdateUserAvatarUseCase } from "./UpdateUserAvatarUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let storageProviderMock: IStorageProvider;
let updateUserAvatarUseCase: UpdateUserAvatarUseCase;

describe("Update User Avatar use case", () => {
  beforeEach(async () => {
    storageProviderMock = mock<IStorageProvider>();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    updateUserAvatarUseCase = new UpdateUserAvatarUseCase(
      inMemoryUsersRepository,
      storageProviderMock
    );

    await inMemoryUsersRepository.createAndSave({
      name: "Tester",
      email: "tester@mail.com",
      password: "testerPa$$w0rd",
    });
  });

  it("Should update user avatar", async () => {
    let user = await inMemoryUsersRepository.findByEmail("tester@mail.com");

    expect(user).toBeDefined();
    if (user) {
      await updateUserAvatarUseCase.execute(user.id, "testFile.png");

      expect(storageProviderMock.save).toHaveBeenCalledWith(
        "testFile.png",
        "usersAvatars"
      );

      expect(user.avatar).toEqual("testFile.png");

      await updateUserAvatarUseCase.execute(user.id, "testFile2.png");

      expect(storageProviderMock.delete).toHaveBeenCalledWith(
        "testFile.png",
        "usersAvatars"
      );

      expect(storageProviderMock.save).toHaveBeenCalledWith(
        "testFile2.png",
        "usersAvatars"
      );

      user = await inMemoryUsersRepository.findByEmail("tester@mail.com");
      expect(user).toBeDefined();
      if (user) {
        expect(user.avatar).toEqual("testFile2.png");
      }
    }
  });

  it("Should not update invalid user's avatar", async () => {
    await expect(
      updateUserAvatarUseCase.execute("invalidUser", "avatarFile.png")
    ).rejects.toEqual(new AuthenticationError());
  });

  it("Should not update user's avatar if empty avatar", async () => {
    const user = await inMemoryUsersRepository.findByEmail("tester@mail.com");
    expect(user).toBeDefined();

    if (user) {
      await expect(
        updateUserAvatarUseCase.execute(user.id, undefined)
      ).rejects.toEqual(new NoAvatarFileError());
    }
  });
});
