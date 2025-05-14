export async function getVendorData(ctx: Context, next: () => Promise<any>) {
    const {
        clients: { masterDataService },
        vtex: { route: { params: { vendorId }}}
    } = ctx;

    try {
        const req = await masterDataService.getVendorData(vendorId as string)

        ctx.status = 200
        ctx.body = req
    }

    catch (error) {
        // eslint-disable-next-line no-console
        ctx.status = 500
        ctx.body = { message: error.message }
    }

    await next()
}
