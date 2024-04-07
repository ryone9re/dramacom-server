import { Comment } from "../domain/models/comment";
import type { User } from "../domain/models/user";
import type { CommentRepository } from "../domain/repositories/comment-repository";
import type { DramaRepository } from "../domain/repositories/drama-repository";
import type { UserRepository } from "../domain/repositories/user-repository";
import { ID } from "../domain/value-objects/id";

type PostCommentInput = {
  author: string;
  targetUser?: string;
  targetDrama: string;
  content: string;
  watchedEpisode: number;
};

export async function PostComment(
  repositories: {
    userRepository: UserRepository;
    dramaRepository: DramaRepository;
    commentRepository: CommentRepository;
  },
  input: PostCommentInput,
) {
  const author = await repositories.userRepository.findByID(
    new ID(input.author),
  );
  if (!author) {
    // TODO エラー作成
    throw new Error("Author Not Found");
  }

  let targetUser: User | null = null;
  if (input.targetUser) {
    targetUser = await repositories.userRepository.findByID(
      new ID(input.targetUser),
    );
    if (!targetUser) {
      // TODO エラー作成
      throw new Error("User Not Found");
    }
  }

  const targetDrama = await repositories.dramaRepository.findByID(
    new ID(input.targetDrama),
  );
  if (!targetDrama) {
    // TODO エラー作成
    throw new Error("Drama Not Found");
  }

  const newComment = Comment.new({
    author,
    targetUser,
    targetDrama,
    content: input.content,
    watchedEpisode: input.watchedEpisode,
  });

  await repositories.commentRepository.save(newComment);
}
