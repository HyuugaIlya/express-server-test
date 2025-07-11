export type TUsersQueryModel = {
    /**
    * username of the search query 
    */
    username?: string,
    /**
    * sort options of the search query
    */
    sort?: 'asc' | 'desc',
    /**
    * limit options of the search query
    */
    limit?: string,
    /**
    * page options of the search query
    */
    page?: string
}