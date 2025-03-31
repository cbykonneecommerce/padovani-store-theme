export interface List {
    slug: string!;
    listName: string!;
    isActive: boolean!;
    userName: string;
    accept: boolean!;
    message: string;
    avatar: string;
    cover: string;
    email: string;
    list: string;
    oldId: int;
}

export interface ListInput {
    slug: List["slug"];
    email: Lists["email"];
}

export type Maybe<T> = T | void;

export interface ISetFinalityOrder {
    email: string;
    finalityOrder: string;
    id: string;
}

export interface OrderDataProps {
    orderId: string;
    status: string;
    customData: {
        customApps: Array<{
            fields: {
                ownerListName: string;
                ownerListEmail: string;
                ownerListId: string;
            };
            id: string;
            major: number;
        }>;
    }
    clientProfileData: {
        userProfileId: string;
        email: string;
        firstName: string;
        lastName: string;
        document: string;
    };
    items: Array<{
        name: string;
        id: string;
        price: string;
    }>;
}

type CustomApp = {
    id: string;
    fields: {
      [key: string]: any; // ou um tipo específico para os campos
    };
};

export interface IData {
    rclastcart: string;
    email: string;
    firstName: string;
}