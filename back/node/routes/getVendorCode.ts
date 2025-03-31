export async function getVendorCode(ctx: Context, next: () => Promise<any>) {
    const {
        clients: { masterDataService },
        vtex: { route: { params: { code }}}
    } = ctx;

    try {
        const req = await masterDataService.getVendorCode(code as string)

        ctx.status = 200
        ctx.body = req
    }

    catch (error) {
        // eslint-disable-next-line no-console
        console.log(error)

        ctx.status = 500
        ctx.body = { message: error.message }
    }

    await next()
}