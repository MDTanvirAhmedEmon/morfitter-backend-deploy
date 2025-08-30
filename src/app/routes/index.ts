import { Router } from "express";
import { UserRouter } from "../modules/users/user.route";
import { AuthRouter } from "../modules/auth/auth.route";
import { AdminRouter } from "../modules/admins/admin.route";
import { ChatsRouter } from "../modules/chats/chats.router";
import { ContentRouter } from "../modules/content/content.route";
import { SessionRouter } from "../modules/session/session.route";
import { TrainerRouter } from "../modules/trainer/trainer.route";
import { SpecialismRouter } from "../modules/specialism/specialism.route";
import { QualificationRouter } from "../modules/qualification/qualification.route";
import { TraineeRouter } from "../modules/trainee/trainee.route";
import { InvitationRouter } from "../modules/invitation/invitation.route";
import { reviewRouter } from "../modules/review/review.route";
import { followAndUnfollowRouter } from "../modules/follower/follower.route";
import { LikesRouter } from "../modules/likes/likes.route";
import { CommentsRouter } from "../modules/comments/comments.route";
import { PolicyAndTemrmsRouter } from "../modules/policyAndTerms/policyAndTerms.route";
import { PurchaseAccessRouter } from "../modules/purchaseAccess/purchaseAccess.route";
import { SessionReviewRouter } from "../modules/sessinReview/sessinReview.route";
import { PaymentRouter } from "../modules/payment/payment.route";
// import { WebHookRouter } from "../modules/payment/webhook.route";

const router = Router();

const moduleRoutes = [
    {
        path: '/users',
        route: UserRouter,
    },
    {
        path: '/auth',
        route: AuthRouter,
    },
    {
        path: '/admin',
        route: AdminRouter,
    },
    {
        path: '/trainer',
        route: TrainerRouter,
    },
    {
        path: '/trainee',
        route: TraineeRouter,
    },
    {
        path: '/invitation',
        route: InvitationRouter,
    },
    {
        path: '/review',
        route: reviewRouter,
    },
    {
        path: '/follower',
        route: followAndUnfollowRouter,
    },
    {
        path: '/specialism',
        route: SpecialismRouter,
    },
    {
        path: '/qualification',
        route: QualificationRouter,
    },
    {
        path: '/content',
        route: ContentRouter,
    },
    {
        path: '/like',
        route: LikesRouter,
    },
    {
        path: '/comment',
        route: CommentsRouter,
    },
    {
        path: '/session',
        route: SessionRouter,
    },
    {
        path: '/session-review',
        route: SessionReviewRouter,
    },
    {
        path: '/policy-term',
        route: PolicyAndTemrmsRouter,
    },
    {
        path: '/access',
        route: PurchaseAccessRouter,
    },
    {
        path: '/chats',
        route: ChatsRouter,
    },
    {
        path: '/payment',
        route: PaymentRouter,
    },
    // {
    //     path: '/stripe',
    //     route: WebHookRouter,
    // },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;