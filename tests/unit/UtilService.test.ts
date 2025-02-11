import { UtilService } from "../../src/utils/utils";
import { v4 } from "uuid";

jest.mock('uuid');

describe("UtilService", () => {
    let utilService: UtilService;

    beforeEach(() => {
        utilService = new UtilService();
    });

    it('should generate a random code', () => {
        (v4 as jest.Mock).mockReturnValue("1234567890");
        const shortCode: string = utilService.generateShortCode();

        expect(shortCode).toHaveLength(10);
        expect(shortCode).toBe("1234567890");
        expect(v4).toHaveBeenCalled();
    });

    it("should throw an error if UUID generation fails", () => {
        (v4 as jest.Mock).mockImplementation(() => {
            throw new Error("UUID generation failed");
        });

        expect(() => utilService.generateShortCode()).toThrow("Failed to generate short code");
    });
});
